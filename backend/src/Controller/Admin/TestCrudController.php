<?php

namespace App\Controller\Admin;

use App\Entity\Point;
use App\Entity\Test;
use App\Entity\User;
use App\Entity\Product;
use App\Form\PointType;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ImageField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IntegerField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\CollectionField;
use EasyCorp\Bundle\EasyAdminBundle\Field\NumberField;

class TestCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Test::class;
    }

    public function configureFields(string $pageName): iterable
    {
        $fields = [
            AssociationField::new('product')
                ->setFormTypeOptions([
                    'class' => Product::class,
                    'choice_label' => 'name',
                ]),
            AssociationField::new('user')
                ->setFormTypeOptions([
                    'class' => User::class,
                    'choice_label' => 'email',
                ]),
            CollectionField::new('points')
                ->setEntryType(PointType::class)
                ->setFormTypeOptions([
                    'mapped' => true,
                    'required' => false,
                ]),
            TextField::new('comment'),
            IntegerField::new('rate'),
            NumberField::new('positiveVotesCount')
                ->setLabel('Positive Votes')
                ->setTemplatePath('admin/votes.html.twig')
                ->setFormTypeOptions([
                    'disabled' => true
                ]),
            NumberField::new('negativeVotesCount')
                ->setLabel('Negative Votes')
                ->setTemplatePath('admin/votes.html.twig')
                ->setFormTypeOptions([
                    'disabled' => true
                ]),
        ];

        if ($pageName === Crud::PAGE_INDEX || $pageName === Crud::PAGE_EDIT) {
            array_unshift($fields, ImageField::new('product.img')
                ->setHelp($this->getImageHelp($pageName))
                ->setBasePath('uploads/images/products/videogames/main_img') // Chemin de base où les images sont stockées
                ->setLabel('Product Image')
                ->setUploadDir('public/uploads/images/products/videogames/main_img'));
        }

        // Ajouter l'ID en premier
        array_unshift($fields, IdField::new('id')->hideOnForm());
        return $fields;
    }

    

    private function getImageHelp(string $pageName): string
    {
        if ($pageName === Crud::PAGE_INDEX || $pageName === Crud::PAGE_EDIT) {
            $test = $this->getContext()->getEntity()->getInstance();
            if ($test && $test->getProduct()) {
                $product = $test->getProduct();
                if ($product && $product->getImg()) {
                    $imagePath = 'uploads/images/products/videogames/main_img/' . $product->getImg();
                    return '<img src="' . $imagePath . '" alt="Product Image" style="width: 100%;">';
                }
            }
        }
        return '';
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setSearchFields(['product.name', 'user.email', 'comment', 'rate']);
    }
}
