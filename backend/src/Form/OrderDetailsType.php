<?php

// src/Form/AddressType.php
namespace App\Form;

use App\Entity\Product;
use App\Entity\OrderDetails;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\MoneyType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\CollectionType;

class OrderDetailsType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder->add('products', EntityType::class, [
            'class' => Product::class,
            'choice_label' => 'name',
            'label' => 'Product'
        ])
            ->add('quantity', IntegerType::class)
            ->add('platform', TextType::class)
            ->add('price', MoneyType::class, ['divisor' => 100])
            ->add('activation_keys', CollectionType::class, [
                'entry_options' => ['label' => false],
                'allow_add' => true,
                'by_reference' => false,
                'allow_delete' => true,
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => OrderDetails::class,
        ]);
    }
}
