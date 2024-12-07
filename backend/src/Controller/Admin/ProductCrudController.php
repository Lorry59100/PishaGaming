<?php

namespace App\Controller\Admin;

use App\Entity\Product;
use Doctrine\ORM\EntityManagerInterface;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ImageField;
use EasyCorp\Bundle\EasyAdminBundle\Field\MoneyField;
use EasyCorp\Bundle\EasyAdminBundle\Field\NumberField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Form\Type\FileUploadType;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class ProductCrudController extends AbstractCrudController
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public static function getEntityFqcn(): string
    {
        return Product::class;
    }

    public function configureFields(string $pageName): iterable
    {
        $fields = [
            IdField::new('id')->hideOnForm(),
            TextField::new('name'),
            AssociationField::new('category')->hideOnIndex(),
            AssociationField::new('edition'),
            AssociationField::new('platform')->hideOnIndex(),
            AssociationField::new('genre')->hideOnIndex(),
            AssociationField::new('tag')->hideOnIndex(),
            TextField::new('trailer')
                ->setHelp($this->getVideoHelp($pageName))
                ->setFormType(FileUploadType::class)
                ->setCustomOption('basePath', 'uploads/videos/videogames/trailer')
                ->setCustomOption('uploadDir', '../public/uploads/videos/videogames/trailer')
                ->hideOnIndex(),
            ImageField::new('img')
                ->setHelp($this->getImageHelp($pageName))
                ->setBasePath('uploads/images/products/videogames/main_img') // Chemin de base des images
                ->setUploadDir('public/uploads/images/products/videogames/main_img') // Répertoire où les images sont stockées
                ->setUploadedFileNamePattern(function (UploadedFile $file) {
                    $extension = $file->guessExtension();
                    return uniqid() . '.' . $extension; // Utilisation de uniqid pour générer un nom de fichier unique avec l'extension correcte
                }),
            TextField::new('dev'),
            TextField::new('editor'),
            TextEditorField::new('description'),
            DateField::new('release'),
            NumberField::new('stock'),
            MoneyField::new('price')->setCurrency('EUR'),
            MoneyField::new('old_price')->setCurrency('EUR'),
        ];

        return $fields;
    }

    private function getVideoHelp(string $pageName): string
    {
        if ($pageName === Crud::PAGE_EDIT) {
            $product = $this->getContext()->getEntity()->getInstance();
            if ($product && $product->getTrailer()) {
                $videoPath = 'uploads/videos/videogames/trailer/' . $product->getTrailer();
                return '<video width="320" height="240" controls><source src="' . $videoPath . '" type="video/mp4">Your browser does not support the video tag.</video>';
            }
        }

        return '';
    }

    private function getImageHelp(string $pageName): string
    {
        if ($pageName === Crud::PAGE_EDIT) {
            $product = $this->getContext()->getEntity()->getInstance();
            if ($product && $product->getImg()) {
                $imagePath = 'uploads/images/products/videogames/main_img/' . $product->getImg();
                return '<img src="' . $imagePath . '" alt="Product Image" style="max-width: 100%;">';
            }
        }

        return '';
    }
}
